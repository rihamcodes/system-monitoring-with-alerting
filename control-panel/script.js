async function fetchMetric(query) {
  const res = await fetch(`http://localhost:9090/api/v1/query?query=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.data.result[0].value[1];
}

async function loadMetrics() {
  try {
    // CPU
    const cpu = await fetchMetric(
      '100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100)'
    );

    // Memory
    const memory = await fetchMetric(
      '(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100'
    );

    // Disk (C drive)
    const disk = await fetchMetric(
      '100 - (node_filesystem_avail_bytes{fstype="9p", mountpoint="/mnt/host/c"} / node_filesystem_size_bytes{fstype="9p", mountpoint="/mnt/host/c"} * 100)'
    );

    document.getElementById("cpu").innerText = cpu + " %";
    document.getElementById("memory").innerText = memory + " %";
    document.getElementById("disk").innerText = disk + " %";

  } catch (err) {
    console.error(err);
  }
}

loadMetrics();
setInterval(loadMetrics, 5000);