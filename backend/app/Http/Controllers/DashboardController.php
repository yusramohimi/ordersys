<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Commande;
use App\Models\StockMovement;
use App\Models\Client;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getOrdersStats()
    {
        // Statistiques des commandes par statut
        $ordersByStatus = Commande::select(
            'statut',
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(prix_total) as total')
        )
            ->groupBy('statut')
            ->get();

        // Commandes des 6 derniers mois
        $monthlyOrders = Commande::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(prix_total) as total')
        )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'status_stats' => [
                'labels' => $ordersByStatus->pluck('statut'),
                'data' => $ordersByStatus->pluck('count'),
                'colors' => ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#F97316', '#EF4444']
            ],
            'monthly_orders' => [
                'months' => $monthlyOrders->pluck('month'),
                'counts' => $monthlyOrders->pluck('count'),
                'totals' => $monthlyOrders->pluck('total')
            ]
        ]);
    }

    public function getStockMovements()
    {
        // Mouvements de stock par type
        $stockMovements = StockMovement::select(
            'type',
            DB::raw('SUM(quantite) as total'),
            DB::raw('COUNT(*) as count')
        )
            ->groupBy('type')
            ->get();

        // Produits les plus mouvementés
        $activeProducts = StockMovement::with('produit')
            ->select(
                'produit_id',
                DB::raw('SUM(CASE WHEN type = "entrée" THEN quantite ELSE -quantite END) as net_change')
            )
            ->groupBy('produit_id')
            ->orderByDesc('net_change')
            ->limit(5)
            ->get();

        return response()->json([
            'movement_types' => [
                'labels' => $stockMovements->pluck('type'),
                'data' => $stockMovements->pluck('total'),
                'colors' => ['#10B981', '#EF4444', '#3B82F6']
            ],
            'active_products' => $activeProducts->map(function ($item) {
                return [
                    'name' => $item->produit->nom,
                    'net_change' => $item->net_change
                ];
            })
        ]);
    }

    public function getClientsGrowth()
    {
        // Nouveaux clients par mois
        $clientsGrowth = Client::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Clients par région
        $clientsByRegion = Client::with('region')
            ->select(
                'region_id',
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('region_id')
            ->get();

        return response()->json([
            'growth' => [
                'months' => $clientsGrowth->pluck('month'),
                'counts' => $clientsGrowth->pluck('count')
            ],
            'by_region' => $clientsByRegion->map(function ($item) {
                return [
                    'region' => $item->region->nom,
                    'count' => $item->count
                ];
            })
        ]);
    }
    public function getMetrics()
    {
        return response()->json([
            'total_revenue' => [
                'value' => Commande::sum('prix_total'),
                'change' => $this->calculatePercentageChange(
                    Commande::whereMonth('created_at', now()->subMonth()->month)->sum('prix_total'),
                    Commande::whereMonth('created_at', now()->month)->sum('prix_total')
                )
            ],
            'total_orders' => [
                'value' => Commande::count(),
                'change' => $this->calculatePercentageChange(
                    Commande::whereMonth('created_at', now()->subMonth()->month)->count(),
                    Commande::whereMonth('created_at', now()->month)->count()
                )
            ],
            'total_clients' => [
                'value' => Client::count(),
                'change' => $this->calculatePercentageChange(
                    Client::whereMonth('created_at', now()->subMonth()->month)->count(),
                    Client::whereMonth('created_at', now()->month)->count()
                )
            ],
            'conversion_rate' => [
                'value' => $this->calculateConversionRate(),
                'change' => $this->calculatePercentageChange(
                    $this->calculateConversionRate(now()->subMonth()),
                    $this->calculateConversionRate()
                )
            ]
        ]);
    }

    private function calculatePercentageChange($oldValue, $newValue)
    {
        if ($oldValue == 0) return 0;
        return (($newValue - $oldValue) / $oldValue) * 100;
    }

    private function calculateConversionRate($date = null)
    {
        $query = $date ? Commande::whereMonth('created_at', $date->month) : Commande::query();

        $totalOrders = $query->count();
        $completedOrders = $query->where('statut', 'livrée')->count();

        return $totalOrders > 0 ? ($completedOrders / $totalOrders) * 100 : 0;
    }
}
