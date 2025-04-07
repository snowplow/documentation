import React from 'react';
import Layout from '@theme/Layout';
import { 
  Home, 
  Settings, 
  User, 
  Bell, 
  Search, 
  Mail, 
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';

export default function TailwindTest() {
  return (
    <Layout title="Tailwind Test Page">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-8 flex items-center gap-2">
          <Home className="w-8 h-8" />
          Tailwind CSS Test Page
        </h1>
        
        {/* Card Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-semibold text-gray-800">Card 1</h2>
            </div>
            <p className="text-gray-600">This is a test card with Tailwind CSS styling.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-semibold text-gray-800">Card 2</h2>
            </div>
            <p className="text-gray-600">Another test card with different styling.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-semibold text-gray-800">Card 3</h2>
            </div>
            <p className="text-gray-600">A third card to test grid layout.</p>
          </div>
        </div>

        {/* Button Section */}
        <div className="space-y-4 mb-8">
          <div className="flex gap-4">
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Primary Button
            </Button>
            <Button variant="secondary">
              <CheckCircle className="w-4 h-4 mr-2" />
              Secondary Button
            </Button>
            <Button variant="destructive">
              <XCircle className="w-4 h-4 mr-2" />
              Destructive Button
            </Button>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Outline Button
            </Button>
            <Button variant="ghost">
              <Bell className="w-4 h-4 mr-2" />
              Ghost Button
            </Button>
            <Button variant="link">
              <ChevronRight className="w-4 h-4 mr-2" />
              Link Button
            </Button>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-md">
          <div className="mb-4">
            <label className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-2" htmlFor="username">
              <User className="w-4 h-4" />
              Username
            </label>
            <div className="relative">
              <input
                className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="mb-6">
            <label className=" text-gray-700 text-sm font-bold mb-2 flex items-center gap-2" htmlFor="password">
              <Mail className="w-4 h-4" />
              Password
            </label>
            <div className="relative">
              <input
                className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
              />
              <ChevronRight className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Alert Section */}
        <div className="space-y-4">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 flex items-start gap-2" role="alert">
            <AlertCircle className="w-5 h-5 mt-1 flex-shrink-0" />
            <div>
              <p className="font-bold">Warning!</p>
              <p>This is a test alert message using Tailwind CSS.</p>
            </div>
          </div>
          
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 flex items-start gap-2" role="alert">
            <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
            <div>
              <p className="font-bold">Success!</p>
              <p>This is a success message with an icon.</p>
            </div>
          </div>
          
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 flex items-start gap-2" role="alert">
            <Info className="w-5 h-5 mt-1 flex-shrink-0" />
            <div>
              <p className="font-bold">Info</p>
              <p>This is an informational message with an icon.</p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
} 