export const config = {
    runtime: 'edge'
}

export default function handler() {
    const result = fetch(
        'https://doctor-management-orcin.vercel.app/doctor-management/schedule/cron'
    )
}