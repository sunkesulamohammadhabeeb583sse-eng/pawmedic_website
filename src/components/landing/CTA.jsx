import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

const CTA = () => {
    return (
        <section className="py-24 bg-gradient-to-r from-emerald-500 to-teal-600 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')]"></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Ready to Give Your Pet the Best Care?
                </h2>
                <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
                    Join thousands of pet owners who trust PawMedic to keep their furry friends healthy and happy.
                </p>

                <div className="flex justify-center">
                    <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-6">
                        <Download className="mr-2 h-5 w-5" />
                        Download for Android
                    </Button>
                </div>

                <p className="mt-6 text-emerald-200 text-sm">
                    Free to download • No credit card required • Start in minutes
                </p>
            </div>
        </section>
    )
}

export default CTA
