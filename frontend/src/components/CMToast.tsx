import React from "react";
import { ToastContainer, Slide } from "react-toastify";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";

const CMToast = () => {
  return <StyledToastContainer />;
};

export default CMToast;

const StyledToastContainer = styled(ToastContainer).attrs({
  transition: Slide,
  autoClose: 3000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
})`
  .Toastify__toast {
    --toastify-toast-width: auto;
    padding-right: 30px;
    font-size: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease;
  }

  .Toastify__toast--success {
    background-color: #e6f4ea;
    color: #2e7d32;
  }

  .Toastify__toast--error {
    background-color: #fdecea;
    color: #c62828;
  }

  .Toastify__toast--info {
    background-color: #e3f2fd;
    color: #0277bd;
  }

  .Toastify__toast--warning {
    background-color: #fff8e1;
    color: #f57f17;
  }

  @media (max-width: 768px) {
    .Toastify__toast {
      font-size: 13px;
      margin-top: 1rem;
      margin-right: 1rem;
    }
  }
`;
