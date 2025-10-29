import FriendRequestList from "../../components/FriendRequests/FriendRequestList";
import FriendList from "../../components/FriendRequests/FriendList";

export default function ConnectionsPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Connected Developers</h2>
      <FriendList />

      <h2 className="text-xl font-bold">Received Requests</h2>
      <FriendRequestList type="received" />

      <h2 className="text-xl font-bold">Sent Requests</h2>
      <FriendRequestList type="sent" />
    </div>
  );
}
