import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Компонент защищенного роута
 * @param {*} Component - компонент, который необходимо отрисовать, если выполнилось условие
 * @returns
 */
export default function ProtectedRoute ({ element: Component, ...props }) {
  return props.isSignIn ? (
    <Component {...props} />
  ) : (
    <Navigate to="/react-mesto-auth/sign-in" replace />
  );
};

