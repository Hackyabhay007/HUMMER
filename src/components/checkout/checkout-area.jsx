import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ErrorMsg from "../common/error-msg";
import useCheckoutSubmit from "@/hooks/use-checkout-submit";
import { addUserToFirestore } from "../../db/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";

const CheckoutArea = () => {
  const checkoutData = useCheckoutSubmit();
  const {
    handleSubmit,
    submitHandler,
    register,
    errors,
    cartTotal = 0,
    isCheckoutSubmit,
    showCard,
    setShowCard,
    shippingCost,
    discountAmount,
  } = checkoutData;

  const { user } = useSelector((state) => state.auth);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Retrieve product details from local storage
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    setSelectedProduct(product);
    console.log(product);
  }, []);

  const onCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
  
    if (name === "cardNumber") {
      // Add hyphens after every 4 digits, but limit the length to 19 characters
      formattedValue = value.replace(/\D/g, "") // Remove non-digit characters
                            .match(/.{1,4}/g)   // Match groups of up to 4 digits
                            ?.join("-")         // Join with hyphens
                            .substr(0, 19)      // Limit to 19 characters (16 digits + 3 hyphens)
                            || "";
    } else if (name === "expiryDate") {
      // Add slash after 2 digits
      formattedValue = value.replace(
        /^([1-9]\/|[2-9])$/g,
        "0$1"
      ).replace(
        /^(0[1-9]|1[0-2])$/g,
        "$1/"
      ).replace(
        /^([0-1])([3-9])$/g,
        "0$1/$2"
      ).replace(
        /^(\d{2})(\d{2})$/g,
        "$1/$2"
      );
    }
  
    setCardDetails({ ...cardDetails, [name]: formattedValue });
  };
  

  const validateCardDetails = () => {
    const { cardNumber, expiryDate, cvc } = cardDetails;
    const cardNumberRegex = /^[0-9]{16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    const cvcRegex = /^[0-9]{3,4}$/;

    return (
      cardNumberRegex.test(cardNumber.replace(/-/g, "")) &&
      expiryDateRegex.test(expiryDate) &&
      cvcRegex.test(cvc)
    );
  };

  const handleCheckout = async (data) => {
    if (validateCardDetails()) {
      const userData = {
        ...data,
        cardDetails: {
          cardNumber: cardDetails.cardNumber.replace(/-/g, ""),
          expiryDate: cardDetails.expiryDate,
          cvc: cardDetails.cvc,
        },
      };

      // Save user data to Firestore
      await addUserToFirestore(userData);

      // Show success popup
      setShowPopup(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } else {
      alert("Please enter valid card details.");
    }
  };

  return (
    <>
      <section
        className="tp-checkout-area pb-120"
        style={{ backgroundColor: "#EFF1F5" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-7 col-lg-7"></div>
            <form onSubmit={handleSubmit(handleCheckout)}>
              <div className="row">
                <div className="col-lg-7">
                  <div className="tp-checkout-bill-area">
                    <h3 className="tp-checkout-bill-title">Billing Details</h3>

                    <div className="tp-checkout-bill-form">
                      <div className="tp-checkout-bill-inner">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="tp-checkout-input">
                              <label>
                                First Name <span>*</span>
                              </label>
                              <input
                                {...register("firstName", {
                                  required: `firstName is required!`,
                                })}
                                name="firstName"
                                id="firstName"
                                type="text"
                                placeholder="First Name"
                                defaultValue={user?.firstName}
                              />
                              <ErrorMsg msg={errors?.firstName?.message} />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="tp-checkout-input">
                              <label>
                                Last Name <span>*</span>
                              </label>
                              <input
                                {...register("lastName", {
                                  required: `lastName is required!`,
                                })}
                                name="lastName"
                                id="lastName"
                                type="text"
                                placeholder="Last Name"
                              />
                              <ErrorMsg msg={errors?.lastName?.message} />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="tp-checkout-input">
                              <label>
                                Country <span>*</span>
                              </label>
                              <input
                                {...register("country", {
                                  required: `country is required!`,
                                })}
                                name="country"
                                id="country"
                                type="text"
                                placeholder="United States (US)"
                              />
                              <ErrorMsg msg={errors?.country?.message} />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="tp-checkout-input">
                              <label>Street address</label>
                              <input
                                {...register("address", {
                                  required: `Address is required!`,
                                })}
                                name="address"
                                id="address"
                                type="text"
                                placeholder="House number and street name"
                              />
                              <ErrorMsg msg={errors?.address?.message} />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="tp-checkout-input">
                              <label>Town / City</label>
                              <input
                                {...register("city", {
                                  required: `City is required!`,
                                })}
                                name="city"
                                id="city"
                                type="text"
                                placeholder="City"
                              />
                              <ErrorMsg msg={errors?.city?.message} />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="tp-checkout-input">
                              <label>Postcode ZIP</label>
                              <input
                                {...register("zipCode", {
                                  required: `zipCode is required!`,
                                })}
                                name="zipCode"
                                id="zipCode"
                                type="text"
                                placeholder="Postcode ZIP"
                              />
                              <ErrorMsg msg={errors?.zipCode?.message} />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="tp-checkout-input">
                              <label>
                                Phone <span>*</span>
                              </label>
                              <input
                                {...register("contactNo", {
                                  required: `ContactNumber is required!`,
                                })}
                                name="contactNo"
                                id="contactNo"
                                type="text"
                                placeholder="Phone"
                              />
                              <ErrorMsg msg={errors?.contactNo?.message} />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="tp-checkout-input">
                              <label>
                                Email address <span>*</span>
                              </label>
                              <input
                                {...register("email", {
                                  required: `Email is required!`,
                                })}
                                name="email"
                                id="email"
                                type="email"
                                placeholder="Email"
                                defaultValue={user?.email}
                              />
                              <ErrorMsg msg={errors?.email?.message} />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="tp-checkout-input">
                              <label>Order notes (optional)</label>
                              <textarea
                                {...register("orderNote", { required: false })}
                                name="orderNote"
                                id="orderNote"
                                placeholder="Notes about your order, e.g. special notes for delivery."
                              />
                            </div>
                          </div>
                          {/* Card Details Section */}
                          <div className="col-md-12">
                            <div className="tp-checkout-input">
                              <label>Card Number</label>
                              <input
                                type="text"
                                name="cardNumber"
                                placeholder="1234 1234 1234 1234"
                                value={cardDetails.cardNumber}
                                onChange={onCardInputChange}
                                className={`form-control ${
                                  !validateCardDetails() &&
                                  cardDetails.cardNumber.length > 0
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="tp-checkout-input">
                              <label>Expiry Date</label>
                              <input
                                type="text"
                                name="expiryDate"
                                placeholder="MM/YY"
                                value={cardDetails.expiryDate}
                                onChange={onCardInputChange}
                                className={`form-control ${
                                  !validateCardDetails() &&
                                  cardDetails.expiryDate.length > 0
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="tp-checkout-input">
                              <label>CVC</label>
                              <input
                                type="text"
                                name="cvc"
                                placeholder="123"
                                value={cardDetails.cvc}
                                onChange={onCardInputChange}
                                className={`form-control ${
                                  !validateCardDetails() &&
                                  cardDetails.cvc.length > 0
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                            </div>
                          </div>
                          {!validateCardDetails() && (
                            <div className="col-md-12">
                              <div className="alert alert-danger" role="alert">
                                Please enter valid card details.
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="tp-checkout-place white-bg">
                    <h3 className="tp-checkout-place-title">Your Order</h3>

                    <div className="tp-order-info-list">
                      <ul>
                        <li className="tp-order-info-list-header">
                          <h4>Product</h4>
                          <h4>Total</h4>
                        </li>

                        {/* Render the product saved in local storage */}
                        {selectedProduct && (
                          <li className="tp-order-info-list-desc">
                            <p>
                              {selectedProduct.title} <span> x 1</span>
                            </p>
                            <span>
                              $
                              <span>
  {selectedProduct && selectedProduct.price ? (
    (
      selectedProduct.price -
      (selectedProduct.price * selectedProduct.discount) / 100
    ).toFixed(2)
  ) : (
    "Price not available"
  )}
</span>

                            </span>
                          </li>
                        )}
                        {/* Other cart details, shipping, and totals */}
                        <li className="tp-order-info-list-total">
                          <span>Total</span>
                          <span>
                          <span>
  {selectedProduct && selectedProduct.price ? (
    (
      selectedProduct.price -
      (selectedProduct.price * selectedProduct.discount) / 100
    ).toFixed(2)
  ) : (
    "Price not available"
  )}
</span>

                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="tp-checkout-payment">
                      <div className="tp-checkout-payment-item">
                       

                        <ErrorMsg msg={errors?.payment?.message} />
                      </div>
                      <div className="tp-checkout-payment-item">
                    

                        <ErrorMsg msg={errors?.payment?.message} />
                      </div>
                    </div>

                    <div className="tp-checkout-btn-wrapper">
                      <button
                        type="submit"
                        disabled={isCheckoutSubmit}
                        className="tp-checkout-btn w-100"
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Popup Modal */}
      {showPopup && (
        <div
          className="modal"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog-centered modal-dialog"
            style={{ maxWidth: "400px", margin: "auto" }}
          >
            <div className="modal-content text-center">
              <div className="modal-body">
                <div className="mb-4">
                  <i
                    className="fa fa-check-circle"
                    style={{ fontSize: "50px", color: "green" }}
                  ></i>
                </div>
                <h5>Payment Successful</h5>
                <p>Your order has been placed successfully!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutArea;
