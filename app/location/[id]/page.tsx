import { getLocation } from "@/lib/db";
import { notFound } from 'next/navigation';
import { Location } from '@/types';

interface Props {
    params: {
        id: string;
    }
}

export default async function LocationPage({ params }: Props) {
    const location: Location | undefined = await getLocation(params.id);
    if(!location) {
        notFound();
    }
    return (
        <div>
            <h1>{location.name}</h1>
            <div>{location.description}</div>
        </div>
    );
}
