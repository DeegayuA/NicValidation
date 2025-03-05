'use client'

import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const Dashboard = () => {
    const router = useRouter()

    return <>
        <h1>Admin Dashboard Page</h1>
        <Button onClick={() => router.push('/admin/protect/addEditAdmin')}>Admin Add Edit</Button>
    </>
}

export default Dashboard
