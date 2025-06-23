export const getReferenceData = async (pWebPage) => {
    console.log("getReferenceData", pWebPage);

    try {
        let wReply = [];
        const res = await fetch(
            // @ts-ignore
            `${import.meta.env.VITE_BACKEND_URL}/reference/webPage/${pWebPage}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                body: null,
            }
        );
        const data = await res.json();
        if (res.ok) {
            for (let wItem of data) {
                let wValue = wItem.value;
                wReply.push(wValue);
            }
            return wReply;
        } else {
            console.log("getReferencedData fail", res);
            return [];
        }
    } catch (err) {
        throw new Error(`getReferenceData try-catch fail ${err}`);
    }
};
