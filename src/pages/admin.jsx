import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import AdminPanel from '../components/AdminPanel';
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Here you can add additional checks to ensure the user is an admin
        // For example, you could check a custom claim or a separate admin list in your database
        setIsAdmin(true);
      } else {
        router.push('/admin-login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <Wrapper>
      <SEO pageTitle="Admin Panel" />
      <HeaderTwo style_2={true} />
      <AdminPanel />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default AdminPage;