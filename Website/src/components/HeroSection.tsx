"use client"

export function HeroSection() {
  return (
    <section className="bg-white text-black font-serif">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">

        {/* ═══════════ TOP BAR ═══════════ */}
        <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-sans border-b border-black py-1 tracking-wide">
          <span className="uppercase">ReadMore Media Pvt. Ltd. | Established 2026 | readmore.in</span>
          <span className="uppercase">Mumbai | Monday, June 23, 2026 | Pages 24 | Price ₹3.00</span>
        </div>

        {/* ═══════════ MASTHEAD ═══════════ */}
        <div className="relative border-b-[3px] border-black">
          <div className="py-4 md:py-6 text-center">
            <h1
              className="text-[60px] sm:text-[90px] md:text-[120px] lg:text-[140px] font-black tracking-[-0.04em] uppercase leading-[0.85]"
              style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
            >
              READMORE
            </h1>
          </div>
          <div className="flex justify-between text-[9px] sm:text-[10px] font-sans uppercase tracking-wider pb-1 border-t border-black pt-1">
            <span>Inclusive of Mumbai Times (in Mumbai city only) | epaper.readmore.in</span>
            <span className="font-bold">India&apos;s Largest Subscription Platform</span>
          </div>

          {/* HAPPYTIMES box - top right */}
          <div className="absolute right-0 top-2 border border-black bg-white p-2 hidden xl:block w-[170px]">
            <div className="font-sans font-black text-sm tracking-widest border-b border-black pb-1 mb-1 uppercase">HappyTimes</div>
            <div className="font-bold text-base leading-tight italic">Knowing is winning!</div>
            <p className="text-[9px] font-sans leading-tight mt-1 text-gray-700">
              250 Lorem ipsum dolor sit amet consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna Croma Vouchers and Cars.
            </p>
          </div>
        </div>

        {/* ═══════════ HEADLINE BANNER ═══════════ */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] border-b-[3px] border-black divide-y md:divide-y-0 md:divide-x divide-black">
          <div className="p-3">
            <h3 className="font-bold text-[18px] sm:text-[22px] uppercase leading-[1.1] tracking-tight">
              &apos;Old Friends&apos; Modi, Abe Talk Ties, World Economy Ahead Of G-20 Summit
            </h3>
          </div>
          <div className="p-3">
            <h3 className="font-bold text-[18px] sm:text-[22px] uppercase leading-[1.1] tracking-tight">
              4 Swiss Bank A/Cs Of Nirav &amp; His Sister With 280Cr Frozen
            </h3>
          </div>
          <div className="p-3 text-[10px] leading-tight text-justify space-y-1">
            <p><span className="font-bold">Lorem ipsum dolor sit amet,</span> consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
            <p><span className="font-bold">Lorem ipsum dolor sit amet, consectetuer adipiscing</span> elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna consequat facilisis.</p>
          </div>
        </div>

        {/* ═══════════ HAPPY TIMES TICKER ═══════════ */}
        <div className="border-b border-black flex flex-wrap text-[9px] sm:text-[10px] font-sans uppercase font-bold items-center bg-gray-50 divide-x divide-black">
          <div className="px-3 py-1 bg-gray-200">Today&apos;s Happy Times</div>
          <div className="px-3 py-1 flex-1 font-normal normal-case">Q1. ad minim veniam, nostrud exerci enim ad nim veniam, quis?</div>
          <div className="px-3 py-1 bg-gray-200">Read</div>
          <div className="px-3 py-1 flex-1 font-normal normal-case">Q2. ad minim veniam, nostrud exerci enim ad nim veniam, quis?</div>
          <div className="px-3 py-1 bg-gray-200 hidden sm:block">Win</div>
        </div>

        {/* ═══════════ MAIN NEWSPAPER GRID ═══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[160px_1fr_280px] divide-y lg:divide-y-0 lg:divide-x divide-black border-b border-black">

          {/* ──── LEFT COLUMN: Small Stories ──── */}
          <div className="divide-y divide-black">
            <div className="py-3 pr-3">
              <h4 className="text-[#cc0000] font-bold text-[20px] leading-[1.05] tracking-tight">EPFO to stick<br/>to 8.65% rate<br/>for 2018-19</h4>
              <p className="text-[10px] text-justify leading-[1.4] mt-2">
                <span className="font-black text-[28px] float-left mr-1 leading-[0.8]">D</span>
                ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit. <b>P7</b>
              </p>
            </div>
            <div className="py-3 pr-3">
              <h4 className="font-bold text-[20px] leading-[1.05] tracking-tight">Sebi safety net<br/>for investors</h4>
              <p className="text-[10px] text-justify leading-[1.4] mt-2">
                <span className="font-black text-[28px] float-left mr-1 leading-[0.8]">C</span>
                onsectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud lobortis suscipit. <b>P11</b>
              </p>
            </div>
            <div className="py-3 pr-3">
              <h4 className="font-bold text-[20px] leading-[1.05] tracking-tight">&apos;Advisers helping<br/>Godrej cousins&apos;</h4>
              <p className="text-[10px] text-justify leading-[1.4] mt-2">
                <span className="font-black text-[28px] float-left mr-1 leading-[0.8]">F</span>
                our ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat exerci tation. <b>P11</b>
              </p>
            </div>
            <div className="py-3 pr-3">
              <h4 className="font-bold text-[20px] leading-[1.05] tracking-tight">AAP govt aid for<br/>sewer cleaners</h4>
              <p className="text-[10px] text-justify leading-[1.4] mt-2">
                <span className="font-black text-[28px] float-left mr-1 leading-[0.8]">T</span>
                he ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat veniam quis nostrud.
              </p>
            </div>
          </div>

          {/* ──── CENTER COLUMN: Main Stories ──── */}
          <div className="px-0 lg:px-4">

            {/* Lead headline */}
            <div className="border-b-[3px] border-black pb-4 pt-2">
              <h2 className="text-[42px] sm:text-[52px] md:text-[62px] font-bold leading-[0.92] tracking-[-0.02em]">
                50% SC ceiling breached as<br/>HC upholds Maratha quota
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Sub-col 1: But Says */}
                <div>
                  <h3 className="text-[24px] font-bold italic leading-[1.1] mb-2">But Says 16%<br/>Must Be Pared<br/>To 13% In Jobs</h3>
                  <p className="text-[9px] font-sans font-bold uppercase text-gray-600 mb-2">Swati.Deshpande<br/>@timesgroup.com</p>
                  <p className="text-[10px] text-justify leading-[1.4]">
                    <b>Mumbai :</b> dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip commodo cons.
                  </p>
                  <p className="text-[10px] text-justify leading-[1.4] mt-2">
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt. Duis autem vel eum quis nostrud exerci tation conseed discord.
                  </p>
                </div>

                {/* Sub-col 2: State of Reservation */}
                <div className="border border-black p-3 flex flex-col items-center text-center">
                  <h4 className="font-black text-[18px] uppercase tracking-tight leading-tight mb-3">State Of<br/>Reservation</h4>
                  <div className="w-full text-[10px] font-bold space-y-1">
                    <div className="flex justify-between border-b border-black pb-1"><span className="text-left">More than 50% proposed</span></div>
                    <div className="flex justify-between border-b border-black pb-1"><span className="text-left">Less than 50%</span></div>
                    <div className="flex justify-between"><span className="text-left">50%</span></div>
                  </div>
                  <p className="text-[10px] text-right italic mt-4 leading-tight">
                    consectetuer sequat. Duis autem vel eum iriureed dolor in and state govt jobs
                  </p>
                  <p className="text-[10px] font-bold text-right mt-2 leading-tight">
                    &quot;Ut wisi enim ad minim venia, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip&quot;
                  </p>
                </div>

                {/* Sub-col 3: continuation text */}
                <div className="text-[10px] text-justify leading-[1.4] space-y-2">
                  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit vulputate velit esse molestie consequat, vel illum dolore eu nibh euismod tincidunt feugiat nulla facilisis at vero eros et consectetuer accumsan.</p>
                  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor SC.</p>
                  <p className="font-bold text-[11px]">▶ Continued on P 8</p>
                </div>
              </div>
            </div>

            {/* Second story row */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-4 pt-3">
              <div>
                <h3 className="text-[36px] sm:text-[42px] font-bold leading-[0.95] tracking-tight mb-2">
                  RAF jets escort AI flight to<br/>London after bomb threat
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-[9px] font-sans font-bold uppercase mb-2 text-gray-600">Manju.V @timesgroup.com</p>
                    <p className="text-[10px] text-justify leading-[1.4]">
                      <b>Mumbai :</b> dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip commodo cons equat dolor.
                    </p>
                    <p className="text-[10px] text-justify leading-[1.4] mt-2">
                      Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat. Duis autem vel eum quis nostrud exerci tation conseed discord ullamcorper suscipit lobortis.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[#cc0000] font-bold text-[18px] leading-tight tracking-tight mb-1">Will go ahead with AI<br/>disinvestment: Govt</h4>
                    <p className="text-[10px] text-justify leading-[1.4]">
                      <span className="font-black text-[24px] float-left mr-1 leading-[0.8]">C</span>ivil ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl aliquip commodo. <b>P 11</b>
                    </p>
                    <p className="text-[10px] text-justify leading-[1.4] mt-2">
                      vel illum dolore eu nibh euismod tincidunt feugiat nulla facilisis at vero eros et consectetuer accumsan. Duis autem vel eum iriure dolor in hendrerit vulputate velit esse molestie consequat, vel illum dolore eu nibh euismod tincidunt feugiat nulla at vero eros nostrud exerci tation section media tizzy.
                    </p>
                  </div>
                </div>
              </div>

              {/* JEE story */}
              <div className="border-l border-black pl-3">
                <h4 className="font-bold text-[22px] leading-tight tracking-tight text-center mb-2">33 of 100 JEE (A)<br/>toppers opt<br/>for IIT-Delhi</h4>
                <p className="text-[10px] text-justify leading-[1.4]">
                  <span className="font-black text-[24px] float-left mr-1 leading-[0.8]">Q</span>ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip nonummy euismod commodo tincidunt.
                </p>
              </div>
            </div>
          </div>

          {/* ──── RIGHT COLUMN ──── */}
          <div className="pl-0 lg:pl-4 pt-2 divide-y divide-black">

            {/* 5 Reasons Box */}
            <div className="pb-3">
              <div className="border border-black mb-0">
                <div className="border-b border-black p-2">
                  <p className="text-[#cc0000] font-sans font-bold text-[10px] uppercase">Ahead Of Modi Meet, Trump</p>
                  <h3 className="font-bold text-[20px] leading-none tracking-tight">SLAMS INDIA ON TARIFFS</h3>
                </div>
                <div className="p-2">
                  <h4 className="font-bold text-[16px] text-[#cc0000] leading-none mb-1">5 REASONS WHY HE&apos;S WRONG</h4>
                  <p className="text-[10px] text-justify leading-[1.3] font-bold mb-2">
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magn-sectetuer sequat. Duis autem vel eum facilisis at vero eros et consectetuer G20 summit.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-start gap-1 mb-1">
                        <span className="text-[32px] font-black leading-none">1</span>
                        <p className="text-[10px] leading-tight">Lorem ipsum dolor sit amet, consectetuer adipiscing elit nonummy</p>
                      </div>
                      <div className="text-[9px] font-sans space-y-0.5 border-t border-black pt-1">
                        <div className="flex justify-between"><span>Bound rate at WTO</span><b>Over 40%</b></div>
                        <div className="flex justify-between border-t border-dotted border-black pt-0.5"><span>Avg import duty</span><b>10.2%</b></div>
                        <div className="flex justify-between border-t border-dotted border-black pt-0.5"><span>Trade-weighted avg</span><b>5.6%</b></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start gap-1 mb-1">
                        <span className="text-[32px] font-black leading-none">2</span>
                        <p className="text-[10px] leading-tight">Lorem ipsum dolor sit amet, consectetuer adipiscing tincids</p>
                      </div>
                      <div className="text-[9px] font-sans space-y-0.5 border-t border-black pt-1">
                        <div className="flex justify-between"><span>India</span><b>13.8%</b></div>
                        <div className="flex justify-between border-t border-dotted border-black pt-0.5"><span>Argentina</span><b>13.7%</b></div>
                        <div className="flex justify-between border-t border-dotted border-black pt-0.5"><span>S. Korea</span><b>13.7%</b></div>
                        <div className="flex justify-between border-t border-dotted border-black pt-0.5"><span>Brazil</span><b>13.4%</b></div>
                        <div className="flex justify-between border-t border-dotted border-black pt-0.5"><span>US</span><b>3.4%</b></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2 border-t border-black pt-2">
                    <div>
                      <div className="flex items-start gap-1"><span className="text-[24px] font-black leading-none">3</span><p className="text-[9px] leading-tight">Items of high tariff</p></div>
                      <div className="text-[9px] font-sans mt-1">
                        <div className="font-bold text-[#cc0000] border-b border-black pb-0.5 mb-0.5">INDIA</div>
                        <div className="flex justify-between"><span>Alcohol</span><b>150</b></div>
                        <div className="flex justify-between"><span>Motorcycles</span><b>50</b></div>
                        <div className="flex justify-between"><span>Routers</span><b>20</b></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-sans mt-5">
                        <div className="font-bold text-blue-800 border-b border-black pb-0.5 mb-0.5">US</div>
                        <div className="flex justify-between"><span>Tobacco</span><b>350</b></div>
                        <div className="flex justify-between"><span>Peanuts</span><b>164</b></div>
                        <div className="flex justify-between"><span>Footwear</span><b>48</b></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start gap-1"><span className="text-[24px] font-black leading-none">4</span><p className="text-[9px] leading-tight">Trade to US ($bn)</p></div>
                      <div className="mt-1 flex gap-1 items-end h-14">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-[7px]">47.9</span>
                          <div className="w-2 bg-black" style={{ height: '35px' }}></div>
                        </div>
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-[7px]">52.4</span>
                          <div className="w-2 bg-black" style={{ height: '40px' }}></div>
                        </div>
                        <div className="w-1"></div>
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-[7px]">26.6</span>
                          <div className="w-2 bg-gray-500" style={{ height: '20px' }}></div>
                        </div>
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-[7px]">35.5</span>
                          <div className="w-2 bg-gray-500" style={{ height: '27px' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-1 mt-2 border-t border-black pt-1">
                    <span className="text-[20px] font-black leading-none">5</span>
                    <p className="text-[9px] leading-tight">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt lobortis commodo. <span className="text-yellow-700 font-bold">| RELATED REPORT, P10</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Class of 1984 */}
            <div className="py-3 grid grid-cols-[1fr_110px] gap-3">
              <div>
                <h3 className="text-[28px] font-bold leading-[0.92] tracking-tight mb-1">Class of 1984 helms top security agencies</h3>
                <p className="text-[9px] font-sans font-bold uppercase mb-1 text-gray-600">Rajshekhar.Jha @timesgroup.com</p>
                <p className="text-[10px] text-justify leading-[1.4]">
                  <b>New Delhi :</b> dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam exerci tation ullamcorper suscipit.
                </p>
              </div>
              <div className="border border-black text-[9px] font-sans">
                <div className="text-[#cc0000] font-bold text-center py-1 border-b border-black uppercase text-[10px]">Chief Of...</div>
                <ul className="p-2 space-y-0.5 leading-tight">
                  <li><b>NIA:</b> YC Modi</li>
                  <li><b>NSG:</b> S Lakhtakia</li>
                  <li><b>CISF:</b> R Ranjan</li>
                  <li><b>BSF:</b> R Mishra</li>
                  <li><b>ITBP:</b> SS Deswal</li>
                  <li><b>RAW:</b> S Goel</li>
                  <li><b>IB:</b> A Kumar</li>
                </ul>
              </div>
            </div>

            {/* Newlyweds */}
            <div className="py-3">
              <h4 className="font-bold text-[20px] leading-[1.05] tracking-tight text-center mb-2">Newlyweds kill<br/>selves after<br/>tiff in Sikar</h4>
              <p className="text-[10px] text-justify leading-[1.4]">
                <span className="font-black text-[28px] float-left mr-1 leading-[0.8]">A</span>
                ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip commodo consectetuer sequa piam hendrerit married.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
