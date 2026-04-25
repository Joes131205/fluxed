import { client } from "@/lib/client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/status")({
    component: RouteComponent,
});

function RouteComponent() {
    const [status, setStatus] = useState("");
    useEffect(() => {
        const getStatus = async () => {
            const res = await client.api.$get();
            const data = await res.json();
            console.log(data);
            setStatus(data.ok ? "Server is healthy" : "Server is down");
        };
        getStatus();
    }, []);
    return (
        <div>
            <p>Status</p>
            <p>{status}</p>
        </div>
    );
}
