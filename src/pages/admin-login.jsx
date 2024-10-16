import React from 'react';
import AdminLogin from '../components/AdminLogin';
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";

const AdminLoginPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Admin Login" />
      <HeaderTwo style_2={true} />
      <AdminLogin />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default AdminLoginPage;