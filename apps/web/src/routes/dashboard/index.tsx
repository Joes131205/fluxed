import { useAuth } from "@/hooks/useAuth";
import { requireAuth } from "@/utils/requireAuth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
    beforeLoad: requireAuth,
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">
                            Hello World!
                        </h1>
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            navigate({ to: "/sign-in" });
                        }}
                        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                            Username
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                            {user?.username || "N/A"}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                            Email
                        </p>
                        <p className="text-lg font-semibold text-gray-900 mt-2 break-all">
                            {user?.email}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                            User ID
                        </p>
                        <p className="text-sm font-mono text-gray-900 mt-2 break-all">
                            {user?.id}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
