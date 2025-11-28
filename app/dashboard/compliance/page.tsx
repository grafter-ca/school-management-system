"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import gsap from "gsap";

// ShadCN UI components
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface School {
  id: string;
  school_id: string;
  name: string;
  status: string;
}

export default function ComplianceDashboard() {
  const [pendingSchools, setPendingSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  const cardRef = useRef(null);

  useEffect(() => {
    fetchPendingSchools();
    animateCards();
  }, []);

  const fetchPendingSchools = async () => {
    try {
      const res = await axios.get("/api/schools?status=PENDING");
      setPendingSchools(res.data);
    } finally {
      setLoading(false);
    }
  };

  const animateCards = () => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });
    }
  };

  const handleApprove = async (id: string) => {
    await axios.patch(`/api/schools/${id}`, { status: "APPROVED" });
    fetchPendingSchools();
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason:");
    if (reason) {
      await axios.patch(`/api/schools/${id}`, { status: "REJECTED" });
      fetchPendingSchools();
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-extrabold">Compliance Officer Dashboard</h1>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingSchools.map((school) => (
            <Card key={school.id} ref={cardRef} className="shadow-lg">
              <CardHeader className="flex flex-col space-y-2">
                <h2 className="text-lg font-semibold">{school.name}</h2>
                <Badge
                  variant="outline"
                  className={`self-start ${
                    school.status === "PENDING" && "text-yellow-600 border-yellow-500"
                  }`}
                >
                  {school.status}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col space-y-3">
                <p>
                  <span className="font-semibold">School ID:</span>{" "}
                  {school.school_id}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button size="sm" variant="secondary" onClick={() => handleApprove(school.id)}>
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleReject(school.id)}>
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
