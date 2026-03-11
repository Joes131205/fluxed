import { useAreas } from "@/hooks/useAreas";
import { useAuth } from "@/hooks/useAuth";
import { requireAuth } from "@/utils/requireAuth";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
    beforeLoad: requireAuth,
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { data: areasData, isLoading, error } = useAreas();
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
                <div className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Your Areas
                        </h2>
                        <Link
                            to="/dashboard/areas/create"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Create Area
                        </Link>
                    </div>

                    {isLoading && (
                        <p className="text-gray-600">Loading areas...</p>
                    )}
                    {error && (
                        <p className="text-red-600">Error: {error.message}</p>
                    )}

                    {areasData?.data && areasData.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {areasData.data.map((area: any) => (
                                <div
                                    key={area.id}
                                    className="bg-white rounded-lg shadow-md p-6"
                                >
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {area.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Weight: {area.weight}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !isLoading && (
                            <p className="text-gray-600">
                                No areas yet. Create one to get started!
                            </p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
