import { getCampaign } from "../../../lib/db";
import { notFound } from 'next/navigation';

interface Props {
    params: {
        id: string;
    }
}

export default async function CampaignPage({ params }: Props) {
    const campaign = await getCampaign(params.id);
    if(!campaign) {
        notFound();
    }
    return (
        <div>
            <h1>{campaign.name}</h1>
            <div>{campaign.description}</div>
        </div>
    );
}
