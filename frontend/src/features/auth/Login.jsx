export default function Login() {
    return (
        <div>   
            <h2>Login</h2>
            <form className="flex flex-col max-w-md">
                <label className="mb-2">
                    Username:
                    <input type="text" name="username" className="ml-2 border rounded p-1" />
                </label>
                <label className="mb-4">
                    Password:
                    <input type="password" name="password" className="ml-2 border rounded p-1" />
                </label>
                <button type="submit" className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600">
                    Login
                </button>
            </form>
        </div>
    );
}