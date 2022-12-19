import { getLocation } from "../../../lib/db";
import { notFound } from 'next/navigation';

interface Props {
    params: {
        id: string;
    }
}

export default async function LocationPage({ params }: Props) {
    const location = await getLocation(params.id);
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
