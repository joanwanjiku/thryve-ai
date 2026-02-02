export default function WorkoutForm() {
  return (
    <div>
      <h2>New Workout</h2>
      <form className="flex flex-col max-w-md">
        <label className="mb-2">
          Date:
          <input type="date" name="date" className="ml-2 border rounded p-1" />
        </label>
        <label className="mb-2">
          Type:
          <input type="text" name="type" className="ml-2 border rounded p-1" placeholder="e.g., Running, Cycling" />
        </label>
        <label className="mb-2">
          Duration (minutes):
          <input type="number" name="duration" className="ml-2 border rounded p-1" />
        </label>
        <label className="mb-4">
          Notes:
          <textarea name="notes" className="ml-2 border rounded p-1 w-full" placeholder="Additional details..."></textarea>
        </label>
        <button type="submit" className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600">
          Save Workout
        </button>
      </form>
    </div>
  );
}