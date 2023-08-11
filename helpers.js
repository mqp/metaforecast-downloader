// helper functions used by individual question downloading scripts

export function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`)
}

export function sleep(ms) {
  return new Promise((resolve) => { setTimeout(resolve, ms) });
}

// retries the task n times, returns the first success or throws on total failure
export async function retry(task, n = 10) {
  for (let i = 0; i < n; i++) {
    try {
      return await task();
    } catch (e) {
      if (i === n - 1) {
        throw e;
      } else {
        log(e.toString())
        await sleep(2000);        
      }
    }
  }
}

// fetches a single blob of question data from the metaforecast API
export async function fetchOne(id) {
  const res = await fetch('https://metaforecast.org/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        question(id: "${id}") {
          history {
            options {
              name
              probability
            }
            fetched
          }
          url
        }
      }`
    })
  });
  if (res.status === 200) {
    return await res.json()
  } else {
    const body = await res.text()
    throw new Error(`Query for ${id} returned ${res.status}: ${body}`);
  }
}

// fetches multiple blobs of data from the metaforecast API serially;
// normalizes the history into { x, y } chart points using the provided `getPoint` function
export async function fetchAll(markets, getPoint) {
  let result = [];
  for (const { id, name, q } of markets) {
    log(`Querying data from ${name} (${id}).`)
    const { data } = await retry(() => fetchOne(id));
    if (data?.question?.history == null) {
      throw new Error(`No data returned from Metaforecast for ID ${id}.`);
    }
    const points = data.question.history.map(item => getPoint(id, item))
    const url = data.question.url;
    log(`Successfully fetched ${points.length} points from ${name}.`)
    result.push({ id, name, points, url });
  }
  return result;
}

