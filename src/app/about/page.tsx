'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, Shield, Truck, Star } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-pink-600 hover:text-pink-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              About <span className="text-pink-600">Mami Papa Babies & Kids</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your trusted partner for quality baby products in Uganda. We're dedicated to providing the best for your little ones.
            </p>
          </div>

          {/* Our Story */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Story</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded with love for little ones, Mami Papa Babies & Kids has been serving families across Uganda with premium baby products. We understand that every parent wants the best for their children, and that's exactly what we deliver.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From essential feeding supplies to adorable clothing, educational toys to safety equipment, we carefully curate our collection to meet the diverse needs of growing families. Our commitment to quality, safety, and affordability has made us a trusted name in baby care.
              </p>
            </div>
          </section>

          {/* Our Values */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Love & Care</h3>
                <p className="text-gray-600 text-sm">Every product is selected with love and care for your little one</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Safety First</h3>
                <p className="text-gray-600 text-sm">All products meet strict safety standards for peace of mind</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">Quick and reliable delivery across Uganda</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Quality</h3>
                <p className="text-gray-600 text-sm">Premium products from trusted brands worldwide</p>
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Get in Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Visit Our Store</h3>
                <p className="text-gray-600 mb-2">
                  123 Baby Street, Kampala, Uganda
                </p>
                <p className="text-gray-600 mb-2">
                  Open: Monday - Saturday, 9AM - 6PM
                </p>
                <p className="text-gray-600">
                  Sunday: 10AM - 4PM
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Contact Us</h3>
                <p className="text-gray-600 mb-2">
                  Phone: +256 783 468 608
                </p>
                <p className="text-gray-600 mb-2">
                  Email: info@mamipaba.com
                </p>
                <p className="text-gray-600">
                  WhatsApp: +256 783 468 608
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
