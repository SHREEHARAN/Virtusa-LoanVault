import React from 'react';
import Login from './Components/Login';
import HomePage from './Components/HomePage';
import LoanForm from './LoanManagerComponents/LoanForm';
import SignupForm from './Components/Signup';
import LoanRequest from './LoanManagerComponents/LoanRequest';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import PrivateRoute from './Components/PrivateRoute'; // Import the PrivateRoute component
import { Navigate } from 'react-router-dom';
import ViewAllLoans from './CustomerComponents/ViewAllLoans';
import AppliedLoans from './CustomerComponents/AppliedLoans';
import LoanApplicationForm from './CustomerComponents/LoanApplicationForm';
import ErrorPage from './Components/ErrorPage';
import ViewLoans from './LoanManagerComponents/ViewLoans';
import ViewFeedback from './LoanManagerComponents/ViewFeedback';
import BranchManagerViewFeedback from './BranchManagerComponents/ViewFeedback';
import LoanDisbursementForm from './LoanManagerComponents/LoanDisbursementForm';
import ViewLoanDisbursement from './LoanManagerComponents/ViewLoanDisbursement';
import LoanApplicationApproval from './BranchManagerComponents/LoanApplicationApproval';
import LoansApproval from './BranchManagerComponents/LoansApproval';
import CustomerPostFeedback from './CustomerComponents/CustomerPostFeedback';
import CustomerMyFeedback from './CustomerComponents/CustomerMyFeedback';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="user">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<SignupForm />} />
        </Route>
        <Route path="/home"  element={  <PrivateRoute>  <HomePage /> </PrivateRoute>}/>   
        <Route path="/viewloans" element={ <PrivateRoute> <ViewLoans /> </PrivateRoute>}  />
        <Route path="/newloan/:loanId?"  element={  <PrivateRoute>  <LoanForm /> </PrivateRoute>}/>   
        <Route path="/loanrequest"  element={  <PrivateRoute>  <LoanRequest /> </PrivateRoute>}/>   
        <Route path="*" element={<Navigate to="/user/login" replace />} />
        <Route path="/availableloan"  element={  <PrivateRoute>  <ViewAllLoans /> </PrivateRoute>}/>   
        <Route path="/appliedloan"  element={  <PrivateRoute>  <AppliedLoans /> </PrivateRoute>}/>   
        <Route path="/loanApplicationForm"  element={  <PrivateRoute>  <LoanApplicationForm /> </PrivateRoute>}/>  
        <Route path="/feedback" element={<PrivateRoute><ViewFeedback/> </PrivateRoute>} />
        <Route path="/branchmanagerfeedback" element={<PrivateRoute><BranchManagerViewFeedback/> </PrivateRoute>} />
        <Route path="/userpostfeedback" element={<PrivateRoute><CustomerPostFeedback/> </PrivateRoute>} />
        <Route path="/usermyfeedback" element={<PrivateRoute><CustomerMyFeedback/> </PrivateRoute>} />
        <Route path="/loansapprovel" element={<PrivateRoute><LoansApproval/> </PrivateRoute>} />
        <Route path="/loanDisbursementForm/:loanApplicationId?/:loanDisbursementId?" element={  <PrivateRoute>  <LoanDisbursementForm /> </PrivateRoute>}/> 
        <Route path="/viewloandisbursement" element={<PrivateRoute><ViewLoanDisbursement/> </PrivateRoute>} />
        <Route path="/loanapplicationapprovel" element={<PrivateRoute><LoanApplicationApproval/> </PrivateRoute>} />
        <Route path="/error"  element={<ErrorPage/> }/>  

     </Routes>
    </BrowserRouter>
  );
}

export default App;
