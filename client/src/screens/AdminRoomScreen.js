import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Tag, Space, Button, Modal } from "antd";

import Loader from "../components/Loader";
import Error from "../components/Error";

function AdminRoomScreen() {
	const [rooms, setRooms] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const deleteRoom = async (roomId) => {
		setError("");
		setLoading(true);
		try {
			await axios.delete(`/api/rooms/delete/room/${roomId}`);
			fetchMyData(); // Refresh the room list after deletion
		} catch (error) {
			console.log(error);
			setError(error.message);
		}
		setLoading(false);
	};

	const confirmDelete = (roomId) => {
		console.log(roomId);
		Modal.confirm({
			title: "Are you sure you want to delete this room?",
			okText: "Yes",
			cancelText: "No",
			onOk: () => deleteRoom(roomId),
		});
	};

	const columns = [
		{
			title: "roomid",
			dataIndex: "_id",
			key: "_id",
		},
		{
			title: "name",
			dataIndex: "name",
			key: "name",
		},
		{ title: "maxcount", dataIndex: "maxcount", key: "maxcount" },
		{ title: "phonenumber", dataIndex: "phonenumber", key: "phonenumber" },
		{ title: "rentperday", dataIndex: "rentperday", key: "rentperday" },
		{ title: "type", dataIndex: "type", key: "type" },
		{
			title: "Actions",
			dataIndex: "actions",
			key: "actions",
			render: (text, record) => (
				<div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
					<Button
						type="link"
						style={{ padding: 0, border: "none", color: "#1890ff" }}
						onClick={() => console.log(`Update room with ID: ${record._id}`)}
					>
						Update
					</Button>
					<Button
						type="link"
						style={{ padding: 0, border: "none", color: "#ff4d4f" }}
						onClick={() => confirmDelete(record._id)}
					>
						Delete
					</Button>
				</div>
			),
		},
	];

	async function fetchMyData() {
		setError("");
		setLoading(true);
		try {
			const data = (await axios.post("/api/rooms/getallrooms")).data;
			setRooms(data);
		} catch (error) {
			console.log(error);
			setError(error);
		}
		setLoading(false);
	}

	useEffect(() => {
		fetchMyData();
	}, []);

	return (
		<div className="row">
			{loading ? (
				<Loader></Loader>
			) : error.length > 0 ? (
				<Error msg={error}></Error>
			) : (
				<>
					<div className="col md-12">
						<button className="btn btn-success" onClick={fetchMyData}>
							Refresh
						</button>
					</div>
					<div className="col-md-12">
						<Table columns={columns} dataSource={rooms} />
					</div>
				</>
			)}
		</div>
	);
}

export default AdminRoomScreen;
