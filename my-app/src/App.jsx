import { createBrowserRouter, RouterProvider } from 'react-router'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="min-h-screen bg-nu-gray-100 font-body text-nu-black">
        <h1 className="text-4xl font-heading font-bold text-nu-red p-8">
          NU Co-op Connect
        </h1>
        <p className="px-8 text-nu-gray-600">
          Project scaffolding complete. Start building!
        </p>
      </div>
    ),
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
