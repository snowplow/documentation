import React, { useEffect } from "react";

export default function ExternalRedirect(props) {
  useEffect(() => {
    window.location.replace(props.to);
  }, []);
  return <span>Redirecting to {props.to}</span>;
}