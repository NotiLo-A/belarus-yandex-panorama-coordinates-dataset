async function scanEntireCityToBlobFast(startOid, maxPoints = 150000) {
    const coordinates = [];
    const fetched = new Set();
    const queued = new Set([startOid]);
    let queue = [startOid];
    let queueIndex = 0;
    const CONCURRENCY = 10;

    const saveToDisk = () => {
        const blob = new Blob([JSON.stringify(coordinates)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "minsk_panoramas.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    try {
        while (queueIndex < queue.length && coordinates.length < maxPoints) {
            const batch = [];
            while (batch.length < CONCURRENCY && queueIndex < queue.length) {
                batch.push(queue[queueIndex++]);
            }

            const promises = batch.map(async (oid) => {
                if (fetched.has(oid)) return null;
                fetched.add(oid);

                const url = `https://api-maps.yandex.ru/services/panoramas/1.x/?l=stv&lang=ru_RU&oid=${oid}&provider=streetview`;
                try {
                    const response = await fetch(url);
                    if (!response.ok) return null;
                    return await response.json();
                } catch {
                    return null;
                }
            });

            const results = await Promise.all(promises);

            for (const json of results) {
                if (!json || json.status !== "success" || !json.data || !json.data.Data) continue;

                const data = json.data.Data;
                const annotation = json.data.Annotation;
                const graph = json.data.Graph;

                coordinates.push(data.Point.coordinates);

                const nextOids = new Set();

                if (annotation.Thoroughfares) {
                    for (const t of annotation.Thoroughfares) {
                        const href = t.Connection.href;
                        const urlObj = new URL(href);
                        const oid = urlObj.searchParams.get("oid");
                        nextOids.add(oid);
                    }
                }

                if (graph && graph.Nodes) {
                    for (const node of graph.Nodes) {
                        nextOids.add(node.panoid);
                    }
                }

                for (const oid of nextOids) {
                    if (!queued.has(oid)) {
                        queued.add(oid);
                        queue.push(oid);
                    }
                }
            }

            if (coordinates.length % 2000 === 0 && coordinates.length > 0) {
                console.log(coordinates.length);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        saveToDisk();
    }

    return coordinates.length;
}

scanEntireCityToBlobFast('YOUR_OID', 150000);