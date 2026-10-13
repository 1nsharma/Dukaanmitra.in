import { db } from '../firebase';
import { writeBatch, doc, collection, query, where, getDocs, serverTimestamp, increment } from 'firebase/firestore';
import { ParsedTransaction } from '../types';

export const logTransaction = async (storeId: string, parsed: ParsedTransaction) => {
  const batch = writeBatch(db);
  const storeRef = doc(db, 'stores', storeId);
  const transactionsRef = collection(storeRef, 'transactions');
  const customersRef = collection(storeRef, 'customers');

  let customerId = '';

  if (parsed.customerName) {
    // Find or create customer
    const q = query(customersRef, where('name', '==', parsed.customerName));
    const querySnapshot = await getDocs(q);
    
    let customerRef;
    if (!querySnapshot.empty) {
      customerRef = doc(customersRef, querySnapshot.docs[0].id);
      customerId = customerRef.id;
      batch.update(customerRef, {
        balance: increment(parsed.type === 'udhaar' ? parsed.amount : parsed.type === 'payment' ? -parsed.amount : 0),
        lastTransactionAt: serverTimestamp()
      });
    } else {
      customerRef = doc(customersRef);
      customerId = customerRef.id;
      batch.set(customerRef, {
        storeId,
        name: parsed.customerName,
        balance: parsed.type === 'udhaar' ? parsed.amount : parsed.type === 'payment' ? -parsed.amount : 0,
        lastTransactionAt: serverTimestamp()
      });
    }
  }

  const newTxRef = doc(transactionsRef);
  batch.set(newTxRef, {
    storeId,
    customerId,
    type: parsed.type,
    amount: parsed.amount,
    description: parsed.description || '',
    timestamp: serverTimestamp()
  });

  // Update store totals
  batch.update(storeRef, {
    totalSales: increment(parsed.type === 'sale' ? parsed.amount : 0),
    totalUdhaar: increment(parsed.type === 'udhaar' ? parsed.amount : parsed.type === 'payment' ? -parsed.amount : 0)
  });

  await batch.commit();
};
