export default function formatDuration(startDate, endDate) {
	let totalTimeMillis = Math.abs(endDate.getTime()-startDate.getTime());
	let totalTimeSecs = Math.floor(totalTimeMillis/1000);
	let totalTimeMins = Math.floor(totalTimeSecs/60);
	let extraSecs = totalTimeSecs % 60;
	let format = "";
	if (totalTimeMins !== 0) {
		format += (totalTimeMins + "min ");
	}
	if (extraSecs !== 0) {
		format += (extraSecs + "sec");
	}
	return format;
}