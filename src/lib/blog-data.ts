
import type { Post, Comment } from '@/docs/backend-types';

// This file contains mock data for the blog to display when the database is empty.

export const mockPost: Post = {
  id: 'mock-post-1',
  title: "UPI Lite: The Game Changer for Small Kiranas",
  slug: "upi-lite-kirana",
  category: "Tech",
  excerpt: "How low-latency payments are reducing queue times in Delhi's busy markets.",
  content: `
    <p>For decades, the sound of clinking coins and rustling notes has been the soundtrack of Indian Kirana stores. But in the age of digital payments, even small transactions can cause delays. Customers fumble with apps, scan QR codes, and wait for confirmation messages. This is where UPI Lite comes in, and it's quietly starting a revolution.</p>
    <h3 class="font-bold text-xl my-4">What is UPI Lite?</h3>
    <p>UPI Lite is a simplified version of UPI, designed for small-value transactions (typically under ₹500). It works by using an on-device wallet, which means payments are processed almost instantly, without needing to enter a PIN for every single transaction. Think of it like a digital cash wallet on your phone.</p>
    <h3 class="font-bold text-xl my-4">Why It Matters for Your Dukaan</h3>
    <ul class="list-disc list-inside space-y-2">
      <li><strong>Speed is King:</strong> During peak hours, every second counts. With UPI Lite, a transaction is completed in a flash. This means shorter queues, happier customers, and more sales.</li>
      <li><strong>Fewer Failed Payments:</strong> Because it works offline from the on-device wallet, UPI Lite is far more reliable than standard UPI, which can fail due to poor network connectivity or bank server issues.</li>
      <li><strong>Cleaner Bank Statements:</strong> Instead of dozens of small entries, UPI Lite transactions are bundled into a single daily entry from your on-device wallet to your bank account, making your hisaab-kitaab much simpler.</li>
    </ul>
    <p class="mt-4">For a small shop owner, these benefits are not small. They translate to better customer experience, more reliable cash flow, and less administrative headache. Adopting UPI Lite is a small step that can make a big difference in the efficiency of your daily operations.</p>
  `,
  author: "DukaanMitra Team",
  createdAt: new Date('2024-07-28T10:00:00Z'),
  views: 134,
  likes: 23
};

export const mockComment: Comment = {
  id: 'mock-comment-1',
  postSlug: 'upi-lite-kirana',
  name: 'Ravi Kumar',
  message: 'Bahut useful article, UPI Lite try karunga.',
  createdAt: new Date('2024-07-28T11:30:00Z'),
};

export function getMockBlogData() {
    return {
        mockPost,
        mockComment
    }
}
