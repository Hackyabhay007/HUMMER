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
  const [cardErrors, setCardErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [isBillingSame, setIsBillingSame] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const router = useRouter();

  useEffect(() => {
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    setSelectedProduct(product);
  }, []);

  const onCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\D/g, "") // Remove non-digit characters
        .match(/.{1,4}/g)   // Match groups of up to 4 digits
        ?.join(" ")         // Join with spaces
        .substr(0, 19) || ""; // Limit to 19 characters (16 digits + 3 spaces)
    } else if (name === "expiryDate") {
      formattedValue = value
        .replace(/^([1-9]\/|[2-9])$/g, "0$1")
        .replace(/^(0[1-9]|1[0-2])$/g, "$1/")
        .replace(/^([0-1])([3-9])$/g, "0$1/$2")
        .replace(/^(\d{2})(\d{2})$/g, "$1/$2");
    }

    setCardDetails({ ...cardDetails, [name]: formattedValue });
  };

  const validateCardDetails = () => {
    const { cardNumber, expiryDate, cvc } = cardDetails;
    const errors = {};

    const cardNumberRegex = /^[0-9]{16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    const cvcRegex = /^[0-9]{3,4}$/;

    if (!cardNumberRegex.test(cardNumber.replace(/ /g, ""))) {
      errors.cardNumber = "Invalid card number. Must be 16 digits.";
    }

    if (!expiryDateRegex.test(expiryDate)) {
      errors.expiryDate = "Invalid expiry date. Must be in MM/YY format.";
    }

    if (!cvcRegex.test(cvc)) {
      errors.cvc = "Invalid CVC. Must be 3 or 4 digits.";
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async (data) => {
    if (validateCardDetails()) {
      const userData = {
        ...data,
        country: selectedCountry,
        cardDetails: {
          cardNumber: cardDetails.cardNumber.replace(/ /g, ""),
          expiryDate: cardDetails.expiryDate,
          cvc: cardDetails.cvc,
        },
      };

      await addUserToFirestore(userData);
      setShowPopup(true);

      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  };

  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "India", "China", "Japan", "Brazil", "Mexico", "South Korea", "Italy", "Russia", "Netherlands"
    // Add more countries as needed
  ];

  return (
    <>
      <section className="tp-checkout-area pb-120" style={{ backgroundColor: "#EFF1F5" }}>
        <div className="container">
          <div className="row justify-content-center">
            <form onSubmit={handleSubmit(handleCheckout)} className="col-lg-8 col-12">
              <div className="row g-4">

                {/* Delivery Section */}
                <div className="col-12">
                  <div className="tp-checkout-bill-area mb-4">
                    <h3 className="tp-checkout-bill-title">Delivery</h3>
                    <div className="tp-checkout-bill-form">
                      <div className="tp-checkout-bill-inner">
                        <div className="row g-3">
                          {/* Country Selection */}
                          <div className="col-12">
                            <label className="form-label">Country/Region</label>
                            <select
                              className="form-select form-control"
                              value={selectedCountry}
                              onChange={(e) => setSelectedCountry(e.target.value)}
                            >
                              {countries.map((country) => (
                                <option key={country} value={country}>
                                  {country}
                                </option>
                              ))}
                            </select>
                          </div>
                          {/* First Name and Last Name */}
                          <div className="col-md-6">
                            <label className="form-label">First name</label>
                            <input
                              {...register("firstName", { required: `First name is required!` })}
                              name="firstName"
                              id="firstName"
                              type="text"
                              placeholder="First Name"
                              defaultValue={user?.firstName}
                              className="form-control"
                            />
                            <ErrorMsg msg={errors?.firstName?.message} />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Last name</label>
                            <input
                              {...register("lastName", { required: `Last name is required!` })}
                              name="lastName"
                              id="lastName"
                              type="text"
                              placeholder="Last Name"
                              className="form-control"
                            />
                            <ErrorMsg msg={errors?.lastName?.message} />
                          </div>

                          {/* Address */}
                          <div className="col-12">
                            <label className="form-label">Address</label>
                            <input
                              {...register("address", { required: `Address is required!` })}
                              name="address"
                              id="address"
                              type="text"
                              placeholder="House number and street name"
                              className="form-control"
                            />
                            <ErrorMsg msg={errors?.address?.message} />
                          </div>

                          {/* Apartment, Suite, etc. */}
                          <div className="col-12">
                            <label className="form-label">Apartment, suite, etc. (optional)</label>
                            <input
                              {...register("apartment", { required: false })}
                              name="apartment"
                              id="apartment"
                              type="text"
                              placeholder="Apartment, suite, etc."
                              className="form-control"
                            />
                          </div>

                          {/* City, State, ZIP Code */}
                          <div className="col-md-6">
                            <label className="form-label">City</label>
                            <input
                              {...register("city", { required: `City is required!` })}
                              name="city"
                              id="city"
                              type="text"
                              placeholder="City"
                              className="form-control"
                            />
                            <ErrorMsg msg={errors?.city?.message} />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">State</label>
                            <input
                              {...register("state", { required: `State is required!` })}
                              name="state"
                              id="state"
                              type="text"
                              placeholder="State"
                              className="form-control"
                            />
                            <ErrorMsg msg={errors?.state?.message} />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">ZIP Code</label>
                            <input
                              {...register("zipCode", { required: `ZIP Code is required!` })}
                              name="zipCode"
                              id="zipCode"
                              type="text"
                              placeholder="ZIP Code"
                              className="form-control"
                            />
                            <ErrorMsg msg={errors?.zipCode?.message} />
                          </div>

                          {/* Phone */}
                          <div className="col-12">
                            <label className="form-label">Phone</label>
                            <input
                              {...register("contactNo", { required: `Contact number is required!` })}
                              name="contactNo"
                              id="contactNo"
                              type="text"
                              placeholder="Phone"
                              className="form-control"
                            />
                            <ErrorMsg msg={errors?.contactNo?.message} />
                          </div>

                          {/* Email Address */}
                          <div className="col-12">
                            <label className="form-label">Email address</label>
                            <input
                              {...register("email", { required: `Email is required!` })}
                              name="email"
                              id="email"
                              type="email"
                              placeholder="Email"
                              defaultValue={user?.email}
                              className="form-control"
                            />
                            <ErrorMsg msg={errors?.email?.message} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Details Section */}
                <div className="col-12">
                  <div className="tp-checkout-bill-area mb-4">
                    <h3 className="tp-checkout-bill-title d-flex justify-content-between align-items-center">
                      Credit Card
                      <img
                        src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png"
                        alt="card supported images"
                        style={{ width: "150px" }}
                      />
                    </h3>
                    <div className="tp-checkout-bill-form">
                      <div className="tp-checkout-bill-inner">
                        <div className="row g-3">
                          {/* Card Number */}
                          <div className="col-12">
                            <label className="form-label">Card Number</label>
                            <input
                              type="text"
                              name="cardNumber"
                              placeholder="1234 1234 1234 1234"
                              value={cardDetails.cardNumber}
                              onChange={onCardInputChange}
                              className={`form-control ${
                                cardErrors.cardNumber ? "is-invalid" : ""
                              }`}
                            />
                            {cardErrors.cardNumber && (
                              <div className="text-danger mt-1">{cardErrors.cardNumber}</div>
                            )}
                          </div>

                          {/* Expiration Date and CVC */}
                          <div className="col-md-6">
                            <label className="form-label">Expiration Date (MM/YY)</label>
                            <input
                              type="text"
                              name="expiryDate"
                              placeholder="MM/YY"
                              value={cardDetails.expiryDate}
                              onChange={onCardInputChange}
                              className={`form-control ${
                                cardErrors.expiryDate ? "is-invalid" : ""
                              }`}
                            />
                            {cardErrors.expiryDate && (
                              <div className="text-danger mt-1">{cardErrors.expiryDate}</div>
                            )}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Security Code</label>
                            <input
                              type="text"
                              name="cvc"
                              placeholder="CVC"
                              value={cardDetails.cvc}
                              onChange={onCardInputChange}
                              className={`form-control ${cardErrors.cvc ? "is-invalid" : ""}`}
                            />
                            {cardErrors.cvc && (
                              <div className="text-danger mt-1">{cardErrors.cvc}</div>
                            )}
                          </div>

                          {/* Billing Address Checkbox */}
                          <div className="col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="billingSame"
                                checked={isBillingSame}
                                onChange={() => setIsBillingSame(!isBillingSame)}
                              />
                              <label className="form-check-label" htmlFor="billingSame">
                                Delivery address is same as Billing address
                              </label>
                            </div>
                          </div>

                          {/* Billing Address Fields (if different) */}
                          {!isBillingSame && (
                            <>
                              <div className="col-12">
                                <label className="form-label">Billing Address</label>
                                <input
                                  {...register("billingAddress", { required: !isBillingSame })}
                                  name="billingAddress"
                                  id="billingAddress"
                                  type="text"
                                  placeholder="Billing Address"
                                  className="form-control"
                                />
                                <ErrorMsg msg={errors?.billingAddress?.message} />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">Billing City</label>
                                <input
                                  {...register("billingCity", { required: !isBillingSame })}
                                  name="billingCity"
                                  id="billingCity"
                                  type="text"
                                  placeholder="City"
                                  className="form-control"
                                />
                                <ErrorMsg msg={errors?.billingCity?.message} />
                              </div>
                              <div className="col-md-3">
                                <label className="form-label">Billing State</label>
                                <input
                                  {...register("billingState", { required: !isBillingSame })}
                                  name="billingState"
                                  id="billingState"
                                  type="text"
                                  placeholder="State"
                                  className="form-control"
                                />
                                <ErrorMsg msg={errors?.billingState?.message} />
                              </div>
                              <div className="col-md-3">
                                <label className="form-label">Billing ZIP Code</label>
                                <input
                                  {...register("billingZipCode", { required: !isBillingSame })}
                                  name="billingZipCode"
                                  id="billingZipCode"
                                  type="text"
                                  placeholder="ZIP Code"
                                  className="form-control"
                                />
                                <ErrorMsg msg={errors?.billingZipCode?.message} />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary Section */}
                <div className="col-12">
                  <div className="tp-checkout-place white-bg p-4">
                    <h3 className="tp-checkout-place-title">Your Order</h3>
                    <div className="tp-order-info-list">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between">
                          <h5>Product</h5>
                          <h5>Total</h5>
                        </li>
                        {selectedProduct && (
                          <li className="list-group-item d-flex justify-content-between">
                            <span>
                              {selectedProduct.title} <strong>x 1</strong>
                            </span>
                            <span>
                              ${(
                                selectedProduct.price -
                                (selectedProduct.price * selectedProduct.discount) / 100
                              ).toFixed(2)}
                            </span>
                          </li>
                        )}
                        <li className="list-group-item d-flex justify-content-between">
                          <strong>Total</strong>
                          <strong>
                            {/* ${(
                              selectedProduct.price -
                              (selectedProduct.price * selectedProduct.discount) / 100
                            ).toFixed(2)} */}
                          </strong>
                        </li>
                      </ul>
                    </div>
                    <div className="tp-checkout-btn-wrapper mt-4">
                      <button
                        type="submit"
                        disabled={isCheckoutSubmit}
                        className="btn btn-primary w-100"
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
