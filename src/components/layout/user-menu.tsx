// src/components/layout/user-menu.tsx
"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/lib/logout"


export function UserMenu() {
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="rounded-full h-auto p-0 hover:bg-gray-100"
                    >
                        <Avatar className="rounded-sm h-8 w-8">
                            <AvatarImage
                                src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
                                alt="User Avatar"
                                className="rounded-sm"
                            />
                            <AvatarFallback className="text-xs">HR</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            setShowLogoutConfirm(true);
                        }}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                    // onClick={logout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Logout</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to log out?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowLogoutConfirm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            // onClick={() => signOut()}
                            onClick={logout}
                        >
                            Log Out
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </>
    );
}



// src/components/layout/user-menu.tsx
// "use client";

// import { LogOut } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { signOut } from "next-auth/react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// export function UserMenu() {
//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button
//                     variant="ghost"
//                     size="icon"
//                     className="rounded-full border-2 border-white shadow-md hover:bg-gray-100 h-10 w-10"
//                 >
//                     <Avatar className="h-8 w-8">
//                         <AvatarImage
//                             src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
//                             alt="User"
//                         />
//                         <AvatarFallback>US</AvatarFallback>
//                     </Avatar>
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-48">
//                 <DropdownMenuItem
//                     className="cursor-pointer text-red-600 focus:text-red-600"
//                     onClick={() => signOut()}
//                 >
//                     <LogOut className="mr-2 h-4 w-4" />
//                     <span>Log out</span>
//                 </DropdownMenuItem>
//             </DropdownMenuContent>
//         </DropdownMenu>
//     );
// }