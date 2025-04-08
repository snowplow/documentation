import React from 'react';
import Layout from '@theme/Layout';

export default function TailwindTest() {
  return (
    <Layout title="Tailwind Test Page">
        
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          Tailwind CSS Test Page
        </h1>
        
        {/* Card Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Card 1</h2>
            <p className="text-gray-600">This is a test card with Tailwind CSS styling.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Card 2</h2>
            <p className="text-gray-600">Another test card with different styling.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Card 3</h2>
            <p className="text-gray-600">A third card to test grid layout.</p>
          </div>
        </div>

        {/* Button Section */}
        <div className="space-y-4 mb-8">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Primary Button
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-4">
            Success Button
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-4">
            Danger Button
          </button>
        </div>

        {/* Form Section */}
        <div className="max-w-md">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
            />
          </div>
        </div>

        {/* Alert Section */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-8" role="alert">
          <p className="font-bold">Warning!</p>
          <p>This is a test alert message using Tailwind CSS.</p>
        </div>
      </main>
    </Layout>
  );
} 