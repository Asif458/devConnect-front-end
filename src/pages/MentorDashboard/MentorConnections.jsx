import React from "react";
import FriendRequestList from "../../components/FriendRequests/FriendRequestList";
import FriendList from "../../components/FriendRequests/FriendList";

export default function MentorConnections() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl font-bold mb-3">Received Requests</h2>
        <FriendRequestList type="received" />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Sent Requests</h2>
        <FriendRequestList type="sent" />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Connected Friends</h2>
        <FriendList />
      </section>
    </div>
  );
}
