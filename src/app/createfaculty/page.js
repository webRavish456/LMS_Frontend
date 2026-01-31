"use client";

import Layout from "@/components/Layout";
import CreateFaculty from "@/components/Faculty/Create/Create";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  return (
    <Layout>
      <ToastContainer position="top-right" />
      <CreateFaculty />
    </Layout>
  );
}
