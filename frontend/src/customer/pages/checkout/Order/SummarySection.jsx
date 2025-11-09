
import Address from '../Address';
import OrderSummary from '../OrderSummary'

const SummarySection = ({
  address,
  setAddress,
  phoneNumber,
  setPhoneNumber,
  selectedLocation,
  setSelectedLocation,
  selectedDeliveryCompany,
  setSelectedDeliveryCompany,
  orderNotes,
  setOrderNotes,
  cart,
  getCartCount,
  productTotalPrice,
  handleOrder,
  submit,
  isProcessing,
  whoami,
  totalPrice
}) => (
  <div className=" space-y-4 sm:space-y-6">
    <Address
      setPhoneNumber={setPhoneNumber}
      setAddress={setAddress}
      setSelectedLocation={setSelectedLocation}
      whoami={whoami}
      phoneNumber={phoneNumber}
      setSelectedDeliveryCompany={setSelectedDeliveryCompany}
      selectedDeliveryCompany={selectedDeliveryCompany}
      orderNotes={orderNotes}
      setOrderNotes={setOrderNotes}
    />
    <OrderSummary
      cart={cart}
      getCartCount={getCartCount}
      productTotalPrice={productTotalPrice}
      handleOrder={handleOrder}
      submit={submit}
      isProcessing={isProcessing}
      whoami={whoami}
      phoneNumber={phoneNumber}
      selectedLocation={selectedLocation}
      selectedDeliveryCompany={selectedDeliveryCompany}
      totalPrice = {totalPrice}
    />
  </div>
);

export default SummarySection;
