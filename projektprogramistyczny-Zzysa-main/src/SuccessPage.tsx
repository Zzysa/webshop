const SuccessPage = () => {
  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase!</p>
      <button onClick={() => window.location.href = '/'}>Back to Products</button>
    </div>
  );
};

export default SuccessPage;
