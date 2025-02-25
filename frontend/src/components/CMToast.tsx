import React, { useEffect } from "react";
import { ToastContainer, toast, Zoom } from "react-toastify";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";

const CMToast = () => {
  useEffect(() => {
    const handleClickOutside = () => {
      toast.dismiss();
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return <StyledToastContainer />;
};

export default CMToast;

const StyledToastContainer = styled(ToastContainer).attrs({
  transition: Zoom,
  autoClose: 2000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  draggable: false,
  pauseOnHover: true,
})`
  .Toastify__toast-container {
    position: relative !important;
  }
  .Toastify__toast {
    position: absolute !important;
    border-radius: 12px !important;
    white-space: nowrap !important;
    width: auto !important;
    padding-right: 33px !important;
  }
  @media (max-width: 480px) {
    .Toastify__toast {
      top: 50vh !important;
      right: 50vw !important;
      transform: translate(50%, -50%);
    }
  }
`;
