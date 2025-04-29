import PublicProfile from "@/app/components/Profile/PublicProfile/PublicProfile";


export default function Page({ params }) {
    return <PublicProfile username={params.username} />;
  }