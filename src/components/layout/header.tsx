
"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui/button';


const Header = () => {
    const pathname = usePathname();

    // Example navigation items
    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-primary dark:text-white">
                    MyApp
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === item.href
                                ? 'bg-primary text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center space-x-4">
                    <Button variant="outline" href="/login" size="sm">
                        Login
                    </Button>
                    <Button variant="primary" href="/register" size="sm">
                        Register
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;