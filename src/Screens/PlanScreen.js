import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import db from "../firebase";
import "./PlanScreen.css";
import { loadStripe } from "@stripe/stripe-js";

function PlansScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      const subscriptionsSnapshot = await getDocs(
        collection(db, "customers", user.uid, "subscriptions")
      );

      subscriptionsSnapshot.forEach((subscriptionDoc) => {
        const subscriptionData = subscriptionDoc.data();
        setSubscription({
          role: subscriptionData.role,
          current_period_end: subscriptionData.current_period_end.seconds,
          current_period_start: subscriptionData.current_period_start.seconds,
        });
      });
    };

    fetchSubscription();
  }, [user.uid]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching products...");
        const productsCollection = collection(db, "products");
        const activeProductsQuery = query(
          productsCollection,
          where("active", "==", true)
        );
        const querySnapshot = await getDocs(activeProductsQuery);

        console.log("Query snapshot:", querySnapshot);
        const productsList = await Promise.all(
          querySnapshot.docs.map(async (productDoc) => {
            const productData = productDoc.data();
            console.log("Product data:", productData);
            const priceSnap = await getDocs(
              collection(productDoc.ref, "prices")
            );
            const prices = priceSnap.docs.map((price) => ({
              priceId: price.id,
              priceData: price.data(),
            }));
            return { id: productDoc.id, ...productData, prices };
          })
        );

        console.log("Products list:", productsList);
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchData();
  }, []);

  const loadCheckout = async (priceId) => {
    if (!user) {
      alert("You must be logged in to subscribe.");
      return;
    }

    try {
      const docRef = await addDoc(
        collection(db, "customers", user.uid, "checkout_sessions"),
        {
          price: priceId,
          success_url: window.location.origin,
          cancel_url: window.location.origin,
        }
      );

      onSnapshot(docRef, async (snap) => {
        const { error, sessionId } = snap.data();

        if (error) {
          alert(`An error occurred: ${error.message}`);
        }

        if (sessionId) {
          const stripe = await loadStripe(
            process.env.REACT_APP_STRIPE_PUBLISH_KEY
          );
          stripe.redirectToCheckout({ sessionId });
        }
      });
    } catch (error) {
      console.error("Error loading checkout: ", error);
    }
  };

  return (
    <div className="planScreen">
      <br />
      {subscription && (
        <p>
          Renwal date :{" "}
          {new Date(
            subscription?.current_period_end * 1000
          ).toLocaleDateString()}
        </p>
      )}
      {Object.entries(products).map(([productId, productData]) => {
        const isCurrentPackage = productData.name
          ?.toLowerCase()
          .includes(subscription?.role);
        return (
          <div
            key={productId}
            className={`${
              isCurrentPackage && "planScreen_plan_disabled"
            } planScreen_plan`}
          >
            <div className="planScreen_info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button onClick={() => loadCheckout(productData.prices[0].priceId)}>
              {isCurrentPackage ? "Current Package" : "Subscribe"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlansScreen;
