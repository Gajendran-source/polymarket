const Portfolio = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 
    bg-white text-gray-900 
    dark:bg-[#020617] dark:text-white">

      {/* Top Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">

        {/* Portfolio Card */}
        <div className="bg-white border border-gray-200 
        dark:bg-[#0f1720] dark:border-[#1f2a37] 
        rounded-xl p-6">

          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Portfolio
              </p>

              <h2 className="text-3xl font-semibold">$0.00</h2>

              <p className="text-gray-400 dark:text-gray-500 text-sm">
                $0.00 (0%) past day
              </p>
            </div>

            <div className="text-right">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Available to trade
              </p>
              <p className="text-lg">$0.00</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
              Deposit
            </button>

            <button className="border border-gray-300 
            dark:border-gray-600 
            px-6 py-2 rounded-lg 
            text-gray-700 dark:text-gray-300 
            hover:bg-gray-100 dark:hover:bg-gray-800">
              Withdraw
            </button>
          </div>

        </div>

        {/* Profit / Loss Card */}
        <div className="bg-white border border-gray-200 
        dark:bg-[#0f1720] dark:border-[#1f2a37] 
        rounded-xl p-6">

          <div className="flex justify-between mb-4">

            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Profit/Loss
              </p>

              <h2 className="text-2xl font-semibold">$0.00</h2>

              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Past Month
              </p>
            </div>

            <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-400">
              <button>1D</button>
              <button>1W</button>
              <button className="text-blue-500 dark:text-blue-400">1M</button>
              <button>ALL</button>
            </div>

          </div>

          <div className="h-16 
          bg-gradient-to-r 
          from-blue-100 to-blue-200
          dark:from-blue-900/20 dark:to-blue-500/20 
          rounded-md"></div>

        </div>

      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 
      dark:border-gray-800 pb-3 mb-6">

        <button className="font-medium">
          Positions
        </button>

        <button className="text-gray-500 dark:text-gray-400">
          Open orders
        </button>

        <button className="text-gray-500 dark:text-gray-400">
          History
        </button>

      </div>

      {/* Search + Filter */}
      <div className="flex justify-between items-center mb-6">

        <input
          type="text"
          placeholder="Search"
          className="bg-white border border-gray-300 
          dark:bg-[#0f1720] dark:border-[#1f2a37] 
          rounded-lg px-4 py-2 w-72 outline-none"
        />

        <button className="border border-gray-300 
        dark:border-gray-700 
        px-4 py-2 rounded-lg text-sm">
          Current value
        </button>

      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 
      dark:bg-[#0f1720] dark:border-[#1f2a37] 
      rounded-xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="text-gray-500 dark:text-gray-400 
          border-b border-gray-200 dark:border-gray-800">

            <tr>
              <th className="text-left px-6 py-3">MARKET</th>
              <th className="text-left px-6 py-3">AVG → NOW</th>
              <th className="text-left px-6 py-3">TRADED</th>
              <th className="text-left px-6 py-3">TO WIN</th>
              <th className="text-left px-6 py-3">VALUE</th>
            </tr>

          </thead>

          <tbody>

            <tr>
              <td colSpan={5} className="text-center py-12 text-gray-400">
                No positions found.
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Portfolio;