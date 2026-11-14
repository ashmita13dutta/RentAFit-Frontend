import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatters";

function CartNotification() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const handleCartAdded = (event) => {
      setNotification({
        id: `${event.detail?.lineId || "cart"}-${Date.now()}`,
        ...event.detail,
      });
    };

    window.addEventListener("rentafit:cart-item-added", handleCartAdded);
    return () => {
      window.removeEventListener("rentafit:cart-item-added", handleCartAdded);
    };
  }, []);

  if (!notification) return null;

  return (
    <div className="cart-notification-shell" aria-live="polite" aria-atomic="true">
      <div key={notification.id} className="cart-notification" role="status">
        <button
          type="button"
          className="cart-notification__close"
          onClick={() => setNotification(null)}
          aria-label="Dismiss cart notification"
        >
          &times;
        </button>

        {notification.imageUrl ? (
          <img
            src={notification.imageUrl}
            alt={notification.name}
            className="cart-notification__thumb"
            loading="lazy"
          />
        ) : null}

        <div className="cart-notification__content">
          <p className="cart-notification__eyebrow mb-1">Added to cart</p>
          <strong className="cart-notification__title">{notification.name}</strong>
          <p className="cart-notification__meta mb-0">
            {notification.size ? (
              <>
                {`Size ${notification.size} `}
                &middot;{" "}
              </>
            ) : null}
            {notification.addedQuantity || 1} item added &middot; {formatCurrency(notification.price || 0)}
          </p>
        </div>

        <button
          type="button"
          className="btn cart-notification__action"
          onClick={() => {
            setNotification(null);
            navigate("/cart");
          }}
        >
          View cart
        </button>
      </div>
    </div>
  );
}

export default CartNotification;
