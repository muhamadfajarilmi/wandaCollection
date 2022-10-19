import React from 'react';
import axios from 'axios';
import moment from 'moment';
import Table from 'react-bootstrap/Table';
import './../App.css';

export default class TransactionComponent extends React.Component {
    state = {
        transactionList: []
    }

    componentDidMount() {
        this.getAllTransaction();
    }

    getAllTransaction() {
        axios.get("http://localhost:3002/transaction")
          .then(res => {
            const transactionList = res.data;
            this.setState({ transactionList });
          })
      }

    render() {
        var number=0;
        return(
        <div className="transaction">
            <h1>Transaction History :</h1>
            <Table striped="columns" bordered hover>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Kode Transaksi</th>
                    <th>Kode Barang</th>
                    <th>Jenis Transaksi</th>
                    <th>Nama Admin</th>
                    <th>Nama Pembeli</th>
                    <th>Jumlah</th>
                    <th>Harga</th>
                    <th>Diskon</th>
                    <th>Tanggal</th>
                </tr>
            </thead>
            {this.state.transactionList.map((transaction) => {
                number++;
                return (
                    <tbody key={transaction.id}>
                        <tr>
                        <td>{number}</td>
                        <td>{transaction.kode_transaksi}</td>
                        <td>{transaction.kode_barang}</td>
                        <td>{transaction.jenis_transaksi}</td>
                        <td>{transaction.nama_penjual}</td>
                        <td>{transaction.nama_pembeli}</td>
                        <td>{transaction.jumlah}</td>
                        <td>Rp. {new Intl.NumberFormat(['ban', 'id']).format(transaction.harga)}</td>
                        <td>Rp. {new Intl.NumberFormat(['ban', 'id']).format(transaction.diskon)}</td>
                        <td>{moment(transaction.tanggal).format('DD/MM/YYYY hh:mm:ss a')}</td>
                        </tr>
                    </tbody>
                )
            })}
        </Table>
        </div>
    )}
}