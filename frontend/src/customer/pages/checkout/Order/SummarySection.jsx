
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
  calculateTotal,
  handleOrder,
  submit,
  isProcessing,
  whoami,
}) => (
  <div className="lg:col-span-4 space-y-4 sm:space-y-6">
    <Address
      setPhoneNumber={setPhoneNumber}
      setAddress={setAddress}
      setSelectedLocation={setSelectedLocation}
      whoami={whoami}
      phoneNumber={phoneNumber}
      address={address}
      selectedLocation={selectedLocation}
      setSelectedDeliveryCompany={setSelectedDeliveryCompany}
      selectedDeliveryCompany={selectedDeliveryCompany}
      orderNotes={orderNotes}
      setOrderNotes={setOrderNotes}
    />
    <OrderSummary
      cart={cart}
      getCartCount={getCartCount}
      calculateTotal={calculateTotal}
      handleOrder={handleOrder}
      submit={submit}
      isProcessing={isProcessing}
      whoami={whoami}
      phoneNumber={phoneNumber}
      selectedLocation={selectedLocation}
      selectedDeliveryCompany={selectedDeliveryCompany}
      setOrderNotes={setOrderNotes}
    />
  </div>
);

export default SummarySection;
