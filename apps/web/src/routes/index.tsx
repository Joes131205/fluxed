import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: App,
});

function App() {
    return (
        <div>
            <h1>Hello World</h1>
            <Link to="/dashboard">Dashboard</Link>
        </div>
    );
}
