"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import gsap from "gsap";

// ShadCN Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface School {
  id: string;
  school_id: string;
  name: string;
  address: string;
  phone: string;
  status: string;
}

export default function OnboardingDashboard() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", address: "", phone: "" });

  const formRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSchools();
    animateComponents();
  }, []);

  // GSAP animations
  const animateComponents = () => {
    if (formRef.current && tableRef.current) {
      gsap.from(formRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });
      gsap.from(tableRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
      });
    }
  };

  // Fetch schools
  const fetchSchools = async () => {
    try {
      const res = await axios.get("/api/schools");
      setSchools(res.data);
    } catch (err) {
      console.error("Failed to fetch schools:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add new school
  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone) return;

    try {
      await axios.post("/api/schools", form);
      setForm({ name: "", address: "", phone: "" });
      fetchSchools();

      gsap.to(formRef.current, {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      });
    } catch (err) {
      console.error("Failed to add school:", err);
    }
  };

  // Request approval for a school
const handleRequestApproval = async (schoolId: string) => {
  setSchools((prev) =>
    prev.map((s) =>
      s.school_id === schoolId ? { ...s, status: "PENDING" } : s
    )
  );

  // Animate the row for visual feedback
  const row = document.getElementById(`row-${schoolId}`);
  if (row) {
    gsap.fromTo(
      row,
      { backgroundColor: "#fef3c7" }, // light yellow highlight
      { backgroundColor: "#fff", duration: 1 }
    );
  }

  try {
    // Call backend API to update DB and send email
    const res = await axios.patch("/api/onboarding/schools/requestApproval", { schoolId });
    
    if (res.data?.school) {
      // Ensure state is fully synced with DB response
      setSchools((prev) =>
        prev.map((s) =>
          s.school_id === schoolId ? { ...s, status: res.data.school.status } : s
        )
      );
    }
  } catch (err) {
    console.error("Approval request failed:", err);
    // Revert status if API fails
    fetchSchools();
  }
};


  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-2xl md:text-3xl font-extrabold">Onboarding Officer</h1>

      {/* Add School Form */}
      <Card ref={formRef} className="shadow-lg w-full max-w-1/2">
        <CardHeader>
          <h2 className="text-xl font-semibold">Add New School</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddSchool} className="space-y-3">
            <Input
              placeholder="School Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <Button className="w-full" type="submit">
              + Add School
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Schools Table */}
      <Card ref={tableRef} className="shadow-lg w-full overflow-x-auto">
        <CardHeader>
          <h2 className="text-lg md:text-xl font-semibold">Submitted Schools</h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ) : (
            <table className="w-full min-w-[700px] border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr className="text-left text-[14px] md:text-sm lg:text-base">
                  <th className="p-3">School ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((school) => (
                  <tr
                    key={school.id}
                    id={`row-${school.school_id}`}
                    className="border-t hover:bg-blue-50 transition-colors text-[10px] md:text-sm lg:text-base"
                  >
                    <td className="p-3 font-semibold">{school.school_id}</td>
                    <td className="p-3">{school.name}</td>
                    <td className="p-3">{school.address}</td>
                    <td className="p-3">{school.phone}</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          school.status === "APPROVED"
                            ? "default"
                            : school.status === "REJECTED"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {school.status}
                      </Badge>
                    </td>
                    <td className="p-3 flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary">
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleRequestApproval(school.school_id)}
                      >
                        Request Approval
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
