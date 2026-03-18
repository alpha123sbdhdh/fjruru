import React from 'react';

const Testimonials = () => {
  return (
    <section className="py-24 bg-[#000000] border-t border-white/10" id="testimonials">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 uppercase">
            The <span className="text-[#D4AF37]">Proof</span>
          </h2>
          <p className="text-gray-400 max-w-2xl text-sm md:text-base tracking-wide">
            Real results from inside the Arena.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Replica of Image 1: Lewis Colon */}
          <div className="bg-white text-black rounded-xl p-6 shadow-lg flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gray-800 rounded-full overflow-hidden">
                  {/* Avatar placeholder */}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#1877F2] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-bold text-[15px]">Lewis Colon</h3>
              </div>
              <div className="ml-auto text-gray-400">...</div>
            </div>
            
            <div className="text-[15px]">
              <p className="font-bold text-lg mb-2">PAYOUT FOR THIS WEEKEND 💸💰</p>
              <p>Started my own high-ticket offer after a couple months of working as a closer.</p>
              <p>100% Commissions baby.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-5 mt-2 shadow-sm">
              <div className="text-[#635BFF] font-bold text-xl mb-4 tracking-tighter">stripe</div>
              <h4 className="text-2xl font-bold mb-6">$5,406.14 is on the way</h4>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex gap-2">
                  <span className="text-gray-500 font-medium w-32">Amount:</span>
                  <span className="font-medium">$5,406.14</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 font-medium w-32">Estimated arrival:</span>
                  <span className="font-medium">September 6, 2024, by end of day</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 font-medium w-32">To:</span>
                  <span className="font-medium bg-red-500/20 text-red-600 px-2 rounded line-through decoration-red-500 decoration-2">REDACTED BANK</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 font-medium w-32">Payout ID:</span>
                  <span className="font-medium bg-red-500/20 text-red-600 px-2 rounded line-through decoration-red-500 decoration-2">REDACTED ID</span>
                </div>
              </div>

              <button className="bg-[#635BFF] text-white font-medium px-4 py-2 rounded-md text-sm mb-4">
                Track payout
              </button>
              
              <p className="text-xs text-gray-500 leading-tight">
                Don't see your payout on the arrival date?<br/>
                We estimate your payout arrival date based on typical bank processing times, but banks can sometimes take longer than expected to process payouts. Waiting 1 or 2 business days solves most issues. <span className="text-[#635BFF]">Learn more</span>
              </p>
            </div>
          </div>

          {/* Replica of Image 2: Thurman Gallagher */}
          <div className="bg-white text-black rounded-xl p-6 shadow-lg flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gray-800 rounded-full overflow-hidden">
                  {/* Avatar placeholder */}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#1877F2] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-bold text-[15px]">Thurman Gallagher 💸</h3>
              </div>
              <div className="ml-auto text-gray-400">...</div>
            </div>
            
            <div className="text-[15px] space-y-3">
              <h4 className="font-bold text-xl">New Offer - First Month Results</h4>
              <p>Alright, boys, I just ran the numbers from my first month closing with this offer. Honestly, I'm so stoked about this. know the skills I'm building are going to compound into bigger and bigger numbers over the next couple of months.</p>
              
              <ul className="space-y-1">
                <li>Deals - 4 closed</li>
                <li>Net deals - 3</li>
                <li>4/8 = 50% closing rate</li>
                <li>100% retention / No cancels</li>
                <li>Revenue - $150,000</li>
                <li>Commission - $7,500</li>
                <li>Advancements - $1,500 (sales rep bonus included)</li>
                <li>Sales rep of the week - $250 bonus</li>
              </ul>
            </div>
            
            <div className="flex items-center gap-6 text-gray-500 text-sm mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1">👍 7</div>
              <div className="flex items-center gap-1">💬 5</div>
            </div>
          </div>

          {/* Replica of Image 3: iMessage & Stripe */}
          <div className="bg-white text-black rounded-xl p-6 shadow-lg flex flex-col gap-4">
            <div className="space-y-4 mb-4">
              {/* Message 1 */}
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0"></div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 text-[15px] max-w-[85%]">
                  Wrapped up a deal worth $1300 and a sweet 18% slice of the ad pie.
                </div>
              </div>
              {/* Message 2 */}
              <div className="flex gap-2 flex-row-reverse">
                <div className="bg-blue-500 text-white rounded-2xl rounded-tr-none px-4 py-2 text-[15px] max-w-[85%]">
                  You already know g 💯 💯
                </div>
              </div>
              {/* Message 3 */}
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0"></div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 text-[15px] max-w-[85%]">
                  Scored yet another win - a cool $2500 retainer.
                </div>
              </div>
              {/* Message 4 */}
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 opacity-0"></div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 text-[15px] max-w-[85%]">
                  The client attraction effect is beyond what I imagined 🤩
                </div>
              </div>
              {/* Message 5 */}
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0"></div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 text-[15px] max-w-[85%]">
                  Wow, Just landed another pretty juicy client. Secured $1500 retainer.
                </div>
              </div>
              {/* Message 6 */}
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 opacity-0"></div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 text-[15px] max-w-[85%]">
                  This program been a game-changer fr
                </div>
              </div>
            </div>

            {/* Stripe screenshots combined */}
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="text-3xl font-bold tracking-tight mb-4">Today</h4>
                <div className="text-sm text-gray-500 mb-1">Gross volume ⌄</div>
                <div className="text-3xl font-medium mb-1">$1,300.00</div>
                <div className="text-gray-400 text-sm">11:23</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="text-3xl font-bold tracking-tight mb-4">Today</h4>
                <div className="text-sm text-gray-500 mb-1">Gross volume ⌄</div>
                <div className="text-3xl font-medium mb-1">$2,500.00</div>
                <div className="text-gray-400 text-sm">04:03</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="text-3xl font-bold tracking-tight mb-4">Today</h4>
                <div className="text-sm text-gray-500 mb-1">Gross volume ⌄</div>
                <div className="text-3xl font-medium mb-1">$1,500.00</div>
                <div className="text-gray-400 text-sm">06:46</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
