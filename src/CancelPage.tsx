const CancelPage = () => {
  return (
    <div>
      <h1>Payment Cancelled</h1>
      <p>Your payment has been cancelled. You can try again or contact support.</p>
      <button onClick={() => window.location.href = '/'}>Back to Products</button>
    </div>
  );
};

export default CancelPage;