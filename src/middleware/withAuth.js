"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const withAuth = (WrappedComponent, allowedRoles = []) => {
  const AuthComponent = (props) => {
    const router = useRouter();
    const reduxUser = useSelector((state) => state.auth?.loginUser);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = () => {
        let parsedUser = reduxUser;

        if (!parsedUser?.role) {
          try {
            const storedUser = sessionStorage.getItem("user");
            if (storedUser) {
              parsedUser = JSON.parse(storedUser);
            }
          } catch (err) {
            console.error("Failed to parse user from sessionStorage", err);
          }
        }

        if (!parsedUser?.role) {
          // Store the current path as the intended destination
          const currentPath = window.location.pathname;
          sessionStorage.setItem("redirectAfterLogin", currentPath);
          router.replace("/sign-in");
          return;
        }

        if (
          allowedRoles.length > 0 &&
          !allowedRoles.includes(parsedUser.role)
        ) {
          // Store the current path as the intended destination
          const currentPath = window.location.pathname;
          sessionStorage.setItem("redirectAfterLogin", currentPath);
          router.replace("/sign-in");
          return;
        }

        setLoading(false);
      };

      checkAuth();
    }, [reduxUser, allowedRoles, router]);

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-500">Verifying access...</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthComponent;
};

export default withAuth;
